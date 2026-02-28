import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  // India as primary country for TATVA jewelry store
  const countries = ["in"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  // Update store to use INR as default currency
  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "inr",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Mumbai Warehouse",
          address: {
            city: "Mumbai",
            country_code: "IN",
            address_1: "123 Jewelry Lane",
            postal_code: "400001",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "India Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "All India",
        geo_zones: [
          {
            country_code: "in",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivered in 5-7 business days",
          code: "standard",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 0, // Free shipping
          },
          {
            currency_code: "usd",
            amount: 5,
          },
          {
            region_id: region.id,
            amount: 0,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Delivered in 2-3 business days",
          code: "express",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 150,
          },
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 150,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "TATVA Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product categories...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Bracelets",
          handle: "bracelets",
          is_active: true,
          description: "Elegant bracelets for every occasion",
        },
        {
          name: "Necklaces",
          handle: "necklaces",
          is_active: true,
          description: "Stunning necklaces and pendants",
        },
        {
          name: "Earrings",
          handle: "earrings",
          is_active: true,
          description: "Beautiful earrings from studs to danglers",
        },
        {
          name: "Rings",
          handle: "rings",
          is_active: true,
          description: "Exquisite rings for every style",
        },
        {
          name: "Wedding Collection",
          handle: "wedding-collection",
          is_active: true,
          description: "Bridal sets and wedding jewelry",
        },
        {
          name: "Best Sellers",
          handle: "best-sellers",
          is_active: true,
          description: "Our most popular pieces",
        },
        {
          name: "New Arrivals",
          handle: "new-arrivals",
          is_active: true,
          description: "Latest additions to our collection",
        },
        {
          name: "Gifts",
          handle: "gifts",
          is_active: true,
          description: "Perfect gifts for your loved ones",
        },
      ],
    },
  });

  logger.info("Finished seeding product categories.");
  logger.info("Seeding product data...");

  // Helper to get category ID by name
  const getCategoryId = (name: string) => 
    categoryResult.find((cat) => cat.name === name)?.id;

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // Bracelets
        {
          title: "Golden Aura Bracelet",
          category_ids: [getCategoryId("Bracelets")!, getCategoryId("Best Sellers")!],
          description:
            "A stunning golden bracelet featuring intricate Kundan work. Perfect for festive occasions and weddings. Handcrafted by master artisans.",
          handle: "golden-aura-bracelet",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-1.jpg" },
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-2.jpg" },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L"] },
          ],
          variants: [
            {
              title: "Small",
              sku: "GAB-S",
              options: { Size: "S" },
              prices: [{ amount: 129900, currency_code: "inr" }, { amount: 1559, currency_code: "usd" }],
            },
            {
              title: "Medium",
              sku: "GAB-M",
              options: { Size: "M" },
              prices: [{ amount: 129900, currency_code: "inr" }, { amount: 1559, currency_code: "usd" }],
            },
            {
              title: "Large",
              sku: "GAB-L",
              options: { Size: "L" },
              prices: [{ amount: 139900, currency_code: "inr" }, { amount: 1679, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Pearl Charm Bracelet",
          category_ids: [getCategoryId("Bracelets")!, getCategoryId("New Arrivals")!],
          description:
            "Elegant freshwater pearl bracelet with delicate gold-plated charms. A timeless piece for everyday elegance.",
          handle: "pearl-charm-bracelet",
          weight: 30,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-3.jpg" },
          ],
          options: [
            { title: "Size", values: ["6 inch", "7 inch", "8 inch"] },
          ],
          variants: [
            {
              title: "6 inch",
              sku: "PCB-6",
              options: { Size: "6 inch" },
              prices: [{ amount: 89900, currency_code: "inr" }, { amount: 1079, currency_code: "usd" }],
            },
            {
              title: "7 inch",
              sku: "PCB-7",
              options: { Size: "7 inch" },
              prices: [{ amount: 89900, currency_code: "inr" }, { amount: 1079, currency_code: "usd" }],
            },
            {
              title: "8 inch",
              sku: "PCB-8",
              options: { Size: "8 inch" },
              prices: [{ amount: 99900, currency_code: "inr" }, { amount: 1199, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // Necklaces
        {
          title: "Elegance Pearl Necklace",
          category_ids: [getCategoryId("Necklaces")!, getCategoryId("Best Sellers")!],
          description:
            "A classic pearl necklace that exudes sophistication. Features lustrous freshwater pearls with an 18K gold-plated clasp.",
          handle: "elegance-pearl-necklace",
          weight: 80,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-4.jpg" },
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-5.jpg" },
          ],
          options: [
            { title: "Length", values: ['16"', '18"', '20"'] },
          ],
          variants: [
            {
              title: '16 inch',
              sku: "EPN-16",
              options: { Length: '16"' },
              prices: [{ amount: 249900, currency_code: "inr" }, { amount: 2999, currency_code: "usd" }],
            },
            {
              title: '18 inch',
              sku: "EPN-18",
              options: { Length: '18"' },
              prices: [{ amount: 269900, currency_code: "inr" }, { amount: 3239, currency_code: "usd" }],
            },
            {
              title: '20 inch',
              sku: "EPN-20",
              options: { Length: '20"' },
              prices: [{ amount: 289900, currency_code: "inr" }, { amount: 3479, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Rose Gold Pendant Set",
          category_ids: [getCategoryId("Necklaces")!, getCategoryId("Gifts")!],
          description:
            "A delicate rose gold pendant with matching chain. Features a beautiful floral design that complements both western and ethnic wear.",
          handle: "rose-gold-pendant",
          weight: 40,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-6.jpg" },
          ],
          options: [
            { title: "Chain", values: ["With Chain", "Without Chain"] },
          ],
          variants: [
            {
              title: "With Chain",
              sku: "RGP-WC",
              options: { Chain: "With Chain" },
              prices: [{ amount: 219900, currency_code: "inr" }, { amount: 2639, currency_code: "usd" }],
            },
            {
              title: "Without Chain",
              sku: "RGP-NC",
              options: { Chain: "Without Chain" },
              prices: [{ amount: 159900, currency_code: "inr" }, { amount: 1919, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // Earrings
        {
          title: "Celestial Star Earrings",
          category_ids: [getCategoryId("Earrings")!, getCategoryId("New Arrivals")!],
          description:
            "Stunning star-shaped earrings with sparkling cubic zirconia stones. Available in gold and silver plating.",
          handle: "celestial-star-earrings",
          weight: 20,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-7.jpg" },
          ],
          options: [
            { title: "Color", values: ["Gold", "Silver"] },
          ],
          variants: [
            {
              title: "Gold",
              sku: "CSE-G",
              options: { Color: "Gold" },
              prices: [{ amount: 99900, currency_code: "inr" }, { amount: 1199, currency_code: "usd" }],
            },
            {
              title: "Silver",
              sku: "CSE-S",
              options: { Color: "Silver" },
              prices: [{ amount: 99900, currency_code: "inr" }, { amount: 1199, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Traditional Jhumka",
          category_ids: [getCategoryId("Earrings")!, getCategoryId("Wedding Collection")!],
          description:
            "Classic Indian jhumka earrings with intricate meenakari work and pearl drops. Perfect for weddings and festive occasions.",
          handle: "traditional-jhumka",
          weight: 60,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-8.jpg" },
          ],
          options: [
            { title: "Color", values: ["Red", "Green", "Blue"] },
          ],
          variants: [
            {
              title: "Red",
              sku: "TJ-R",
              options: { Color: "Red" },
              prices: [{ amount: 129900, currency_code: "inr" }, { amount: 1559, currency_code: "usd" }],
            },
            {
              title: "Green",
              sku: "TJ-G",
              options: { Color: "Green" },
              prices: [{ amount: 129900, currency_code: "inr" }, { amount: 1559, currency_code: "usd" }],
            },
            {
              title: "Blue",
              sku: "TJ-B",
              options: { Color: "Blue" },
              prices: [{ amount: 129900, currency_code: "inr" }, { amount: 1559, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Diamond Stud Earrings",
          category_ids: [getCategoryId("Earrings")!, getCategoryId("Best Sellers")!],
          description:
            "Elegant diamond stud earrings with brilliant cut cubic zirconia stones set in 925 sterling silver. A must-have for every jewelry collection.",
          handle: "diamond-stud-earrings",
          weight: 15,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-9.jpg" },
          ],
          options: [
            { title: "Carat", values: ["0.5ct", "1ct"] },
          ],
          variants: [
            {
              title: "0.5ct",
              sku: "DSE-05",
              options: { Carat: "0.5ct" },
              prices: [{ amount: 349900, currency_code: "inr" }, { amount: 4199, currency_code: "usd" }],
            },
            {
              title: "1ct",
              sku: "DSE-1",
              options: { Carat: "1ct" },
              prices: [{ amount: 549900, currency_code: "inr" }, { amount: 6599, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // Rings
        {
          title: "Infinity Love Ring",
          category_ids: [getCategoryId("Rings")!, getCategoryId("Gifts")!],
          description:
            "A beautiful infinity symbol ring representing eternal love. Crafted in 925 sterling silver with rose gold plating.",
          handle: "infinity-love-ring",
          weight: 10,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-10.jpg" },
          ],
          options: [
            { title: "Size", values: ["5", "6", "7", "8", "9", "10"] },
          ],
          variants: [
            { title: "Size 5", sku: "ILR-5", options: { Size: "5" }, prices: [{ amount: 159900, currency_code: "inr" }, { amount: 1919, currency_code: "usd" }] },
            { title: "Size 6", sku: "ILR-6", options: { Size: "6" }, prices: [{ amount: 159900, currency_code: "inr" }, { amount: 1919, currency_code: "usd" }] },
            { title: "Size 7", sku: "ILR-7", options: { Size: "7" }, prices: [{ amount: 159900, currency_code: "inr" }, { amount: 1919, currency_code: "usd" }] },
            { title: "Size 8", sku: "ILR-8", options: { Size: "8" }, prices: [{ amount: 169900, currency_code: "inr" }, { amount: 2039, currency_code: "usd" }] },
            { title: "Size 9", sku: "ILR-9", options: { Size: "9" }, prices: [{ amount: 169900, currency_code: "inr" }, { amount: 2039, currency_code: "usd" }] },
            { title: "Size 10", sku: "ILR-10", options: { Size: "10" }, prices: [{ amount: 179900, currency_code: "inr" }, { amount: 2159, currency_code: "usd" }] },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Cocktail Statement Ring",
          category_ids: [getCategoryId("Rings")!, getCategoryId("Best Sellers")!],
          description:
            "Bold and beautiful cocktail ring featuring a large colored stone surrounded by cubic zirconia. Perfect for parties and special occasions.",
          handle: "cocktail-statement-ring",
          weight: 25,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-11.jpg" },
          ],
          options: [
            { title: "Stone Color", values: ["Emerald Green", "Ruby Red", "Sapphire Blue"] },
          ],
          variants: [
            {
              title: "Emerald Green",
              sku: "CSR-E",
              options: { "Stone Color": "Emerald Green" },
              prices: [{ amount: 199900, currency_code: "inr" }, { amount: 2399, currency_code: "usd" }],
            },
            {
              title: "Ruby Red",
              sku: "CSR-R",
              options: { "Stone Color": "Ruby Red" },
              prices: [{ amount: 199900, currency_code: "inr" }, { amount: 2399, currency_code: "usd" }],
            },
            {
              title: "Sapphire Blue",
              sku: "CSR-B",
              options: { "Stone Color": "Sapphire Blue" },
              prices: [{ amount: 199900, currency_code: "inr" }, { amount: 2399, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // Wedding Collection
        {
          title: "Bridal Kundan Set",
          category_ids: [getCategoryId("Wedding Collection")!, getCategoryId("Best Sellers")!],
          description:
            "A magnificent bridal set featuring a choker necklace, matching earrings, and maang tikka. Handcrafted with pure Kundan stones and pearl embellishments.",
          handle: "bridal-kundan-set",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-12.jpg" },
          ],
          options: [
            { title: "Set Type", values: ["Full Set", "Half Set"] },
          ],
          variants: [
            {
              title: "Full Set",
              sku: "BKS-F",
              options: { "Set Type": "Full Set" },
              prices: [{ amount: 1599900, currency_code: "inr" }, { amount: 19199, currency_code: "usd" }],
            },
            {
              title: "Half Set",
              sku: "BKS-H",
              options: { "Set Type": "Half Set" },
              prices: [{ amount: 999900, currency_code: "inr" }, { amount: 11999, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // Additional Budget-Friendly Products (Under 999)
        {
          title: "Minimalist Bar Necklace",
          category_ids: [getCategoryId("Necklaces")!],
          description:
            "A sleek and modern bar pendant necklace. Perfect for layering or wearing solo for a minimalist look.",
          handle: "minimalist-bar-necklace",
          weight: 15,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-13.jpg" },
          ],
          options: [
            { title: "Color", values: ["Gold", "Silver", "Rose Gold"] },
          ],
          variants: [
            {
              title: "Gold",
              sku: "MBN-G",
              options: { Color: "Gold" },
              prices: [{ amount: 69900, currency_code: "inr" }, { amount: 839, currency_code: "usd" }],
            },
            {
              title: "Silver",
              sku: "MBN-S",
              options: { Color: "Silver" },
              prices: [{ amount: 59900, currency_code: "inr" }, { amount: 719, currency_code: "usd" }],
            },
            {
              title: "Rose Gold",
              sku: "MBN-R",
              options: { Color: "Rose Gold" },
              prices: [{ amount: 69900, currency_code: "inr" }, { amount: 839, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Hoop Earrings Set",
          category_ids: [getCategoryId("Earrings")!],
          description:
            "Set of 3 pairs of classic hoop earrings in different sizes. A versatile addition to any jewelry collection.",
          handle: "hoop-earrings-set",
          weight: 25,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-14.jpg" },
          ],
          options: [
            { title: "Finish", values: ["Gold Plated", "Silver Plated"] },
          ],
          variants: [
            {
              title: "Gold Plated",
              sku: "HES-G",
              options: { Finish: "Gold Plated" },
              prices: [{ amount: 79900, currency_code: "inr" }, { amount: 959, currency_code: "usd" }],
            },
            {
              title: "Silver Plated",
              sku: "HES-S",
              options: { Finish: "Silver Plated" },
              prices: [{ amount: 79900, currency_code: "inr" }, { amount: 959, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Crystal Drop Earrings",
          category_ids: [getCategoryId("Earrings")!, getCategoryId("New Arrivals")!],
          description:
            "Elegant crystal drop earrings that catch the light beautifully. Perfect for evening wear and special occasions.",
          handle: "crystal-drop-earrings",
          weight: 18,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,

          images: [
            { url: "https://ik.imagekit.io/tatva/images/tatva-jewlary-image-15.jpg" },
          ],
          options: [
            { title: "Color", values: ["Clear", "Aurora Borealis"] },
          ],
          variants: [
            {
              title: "Clear",
              sku: "CDE-C",
              options: { Color: "Clear" },
              prices: [{ amount: 89900, currency_code: "inr" }, { amount: 1079, currency_code: "usd" }],
            },
            {
              title: "Aurora Borealis",
              sku: "CDE-AB",
              options: { Color: "Aurora Borealis" },
              prices: [{ amount: 99900, currency_code: "inr" }, { amount: 1199, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
  logger.info("✅ TATVA Jewelry Store seed completed successfully!");
}

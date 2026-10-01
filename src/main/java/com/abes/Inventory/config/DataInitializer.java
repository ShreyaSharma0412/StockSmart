package com.abes.Inventory.config;

import com.abes.Inventory.model.*;
import com.abes.Inventory.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final StockTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           SupplierRepository supplierRepository,
                           ProductRepository productRepository,
                           PurchaseOrderRepository purchaseOrderRepository,
                           StockTransactionRepository transactionRepository,
                           UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default demo user account
        if (userRepository.count() == 0) {
            userRepository.save(new User("admin@stocksmart.com", "admin123", "Store Manager", "ADMIN", "Main Warehouse"));
        }

        // Always re-populate to ensure updated catalog is loaded cleanly
        transactionRepository.deleteAll();
        purchaseOrderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        supplierRepository.deleteAll();

        // 1. Categories
        Category catPersonalCare = categoryRepository.save(new Category("Personal Care", "Skincare, hair care, hygiene and wellness items"));
        Category catPantry = categoryRepository.save(new Category("Pantry & Gourmet", "Organic foods, artisan coffee, teas, and condiments"));
        Category catHomeEco = categoryRepository.save(new Category("Eco Home Goods", "Sustainable household goods, cookware and utensils"));
        Category catElectronics = categoryRepository.save(new Category("Retail Tech & Hardware", "Barcode scanners, RFID tags, smart devices"));
        Category catApparel = categoryRepository.save(new Category("Apparel & Accessories", "Eco tote bags, aprons, and retail apparel"));

        // 2. Suppliers
        Supplier supEco = supplierRepository.save(new Supplier("EcoGoods Inc.", "orders@ecogoods.com", "+1-800-555-0199", "100 Green St, San Francisco, CA", "SUP-ECO", 4.9, 2));
        Supplier supArtisan = supplierRepository.save(new Supplier("Artisan Global Supplies", "contact@artisanglobal.com", "+1-888-555-0144", "45 Craft Ave, Portland, OR", "SUP-ART", 4.7, 3));
        Supplier supGreenPack = supplierRepository.save(new Supplier("Green Pack Co.", "sales@greenpack.io", "+1-877-555-0811", "12 Sustainable Way, Austin, TX", "SUP-GPK", 4.8, 2));
        Supplier supTech = supplierRepository.save(new Supplier("SmartSense Hardware", "info@smartsense.tech", "+1-800-555-9000", "88 Silicon Blvd, San Jose, CA", "SUP-TECH", 4.9, 4));

        // 3. Products matching real retail items & market pricing
        Product p1 = productRepository.save(new Product(
                "Apple AirPods Pro (2nd Gen)",
                "SKU-10901",
                "8901234567801",
                "RFID-10901-A",
                "Wireless noise cancelling earbuds with H2 chip and MagSafe charging case.",
                249.00,
                42,
                15,
                30,
                "In Stock",
                "Tech Hub",
                "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80",
                8.5,
                catElectronics,
                supTech
        ));

        Product p2 = productRepository.save(new Product(
                "Logitech MX Master 3S Mouse",
                "SKU-10902",
                "8901234567802",
                "RFID-10902-B",
                "Performance wireless ergonomic mouse with 8K DPI tracking and quiet clicks.",
                99.99,
                8,
                10,
                25,
                "Low Stock",
                "Tech Hub",
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
                6.2,
                catElectronics,
                supTech
        ));

        Product p3 = productRepository.save(new Product(
                "Sony WH-1000XM5 ANC Headphones",
                "SKU-10903",
                "8901234567803",
                "RFID-10903-C",
                "Industry-leading noise canceling over-ear Bluetooth headphones.",
                399.00,
                15,
                8,
                20,
                "In Stock",
                "Tech Hub",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
                5.8,
                catElectronics,
                supTech
        ));

        Product p4 = productRepository.save(new Product(
                "Samsung T7 1TB Portable SSD",
                "SKU-10904",
                "8901234567804",
                "RFID-10904-D",
                "Ultra-fast USB 3.2 Gen 2 external solid state drive (1050MB/s).",
                109.99,
                28,
                12,
                30,
                "In Stock",
                "Tech Hub",
                "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80",
                7.1,
                catElectronics,
                supTech
        ));

        Product p5 = productRepository.save(new Product(
                "Nespresso Vertuo Pods (50 Pack)",
                "SKU-20901",
                "8901234567805",
                "RFID-20901-E",
                "Medium roast espresso coffee capsule pods compatible with Nespresso Vertuo.",
                42.50,
                65,
                20,
                50,
                "In Stock",
                "Store B",
                "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop&q=80",
                9.4,
                catPantry,
                supArtisan
        ));

        Product p6 = productRepository.save(new Product(
                "First Cold-Pressed Olive Oil 750ml",
                "SKU-20902",
                "8901234567806",
                "RFID-20902-F",
                "Single-estate extra virgin Mediterranean olive oil.",
                28.00,
                4,
                12,
                40,
                "Low Stock",
                "Warehouse B",
                "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80",
                4.9,
                catPantry,
                supGreenPack
        ));

        Product p7 = productRepository.save(new Product(
                "Japanese Ceremonial Matcha 100g",
                "SKU-20903",
                "8901234567807",
                "RFID-20903-G",
                "First-harvest ceremonial grade organic green tea powder.",
                36.00,
                18,
                15,
                30,
                "Warning",
                "Store A",
                "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=80",
                5.2,
                catPantry,
                supArtisan
        ));

        Product p8 = productRepository.save(new Product(
                "Raw Organic Wildflower Honey 500g",
                "SKU-20904",
                "8901234567808",
                "RFID-20904-H",
                "100% pure unfiltered cold-extracted wildflower honey jar.",
                16.50,
                0,
                10,
                40,
                "Out of Stock",
                "Store B",
                "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=400&auto=format&fit=crop&q=80",
                6.8,
                catPantry,
                supArtisan
        ));

        Product p9 = productRepository.save(new Product(
                "Stanley Adventure Quencher 40oz",
                "SKU-30901",
                "8901234567809",
                "RFID-30901-I",
                "Vacuum insulated stainless steel tumbler with straw handle.",
                45.00,
                55,
                15,
                40,
                "In Stock",
                "Warehouse A",
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80",
                11.2,
                catHomeEco,
                supGreenPack
        ));

        Product p10 = productRepository.save(new Product(
                "Le Creuset Dutch Oven 5.5 Qt",
                "SKU-30902",
                "8901234567810",
                "RFID-30902-J",
                "Enameled cast iron round Dutch oven in classic Cerise Flame red.",
                420.00,
                6,
                8,
                15,
                "Low Stock",
                "Store A",
                "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&auto=format&fit=crop&q=80",
                3.4,
                catHomeEco,
                supArtisan
        ));

        Product p11 = productRepository.save(new Product(
                "Bamboo Toothbrushes (4-Pack)",
                "SKU-30903",
                "8901234567811",
                "RFID-30903-K",
                "Biodegradable eco-friendly soft charcoal bristle toothbrush set.",
                8.99,
                95,
                25,
                100,
                "In Stock",
                "Warehouse A",
                "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&auto=format&fit=crop&q=80",
                7.9,
                catHomeEco,
                supEco
        ));

        Product p12 = productRepository.save(new Product(
                "Lululemon Everywhere Belt Bag 1L",
                "SKU-40901",
                "8901234567812",
                "RFID-40901-L",
                "Water-repellent fabric waist pack for daily essentials.",
                38.00,
                34,
                15,
                50,
                "In Stock",
                "Store B",
                "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80",
                10.5,
                catApparel,
                supEco
        ));

        Product p13 = productRepository.save(new Product(
                "Patagonia Retro-X Fleece Jacket",
                "SKU-40902",
                "8901234567813",
                "RFID-40902-M",
                "Windproof recycled polyester fleece jacket with chest pocket.",
                229.00,
                12,
                10,
                20,
                "In Stock",
                "Store A",
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=80",
                4.2,
                catApparel,
                supEco
        ));

        Product p14 = productRepository.save(new Product(
                "Cold-Pressed Virgin Coconut Oil 500ml",
                "SKU-50901",
                "8901234567814",
                "RFID-50901-N",
                "100% pure organic raw extra virgin coconut oil.",
                18.50,
                7,
                15,
                50,
                "Low Stock",
                "Warehouse A",
                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80",
                5.0,
                catPersonalCare,
                supEco
        ));

        Product p15 = productRepository.save(new Product(
                "CeraVe Hydrating Facial Cleanser 473ml",
                "SKU-50902",
                "8901234567815",
                "RFID-50902-O",
                "Non-foaming face wash with hyaluronic acid and 3 essential ceramides.",
                15.99,
                48,
                20,
                60,
                "In Stock",
                "Store B",
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80",
                8.9,
                catPersonalCare,
                supEco
        ));

        Product p16 = productRepository.save(new Product(
                "Wireless 2D Barcode Scanner",
                "SKU-10905",
                "8901234567816",
                "RFID-10905-P",
                "Bluetooth & 2.4G handheld barcode reader with charging cradle.",
                89.00,
                22,
                10,
                25,
                "In Stock",
                "Tech Hub",
                "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&auto=format&fit=crop&q=80",
                6.0,
                catElectronics,
                supTech
        ));

        Product p17 = productRepository.save(new Product(
                "UHF Passive RFID Tags (Pack of 100)",
                "SKU-10906",
                "8901234567817",
                "RFID-10906-Q",
                "Adhesive smart label tags for automated warehouse tracking.",
                49.50,
                110,
                30,
                60,
                "In Stock",
                "Tech Hub",
                "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80",
                7.4,
                catElectronics,
                supTech
        ));

        Product p18 = productRepository.save(new Product(
                "Anker 20000mAh Power Bank",
                "SKU-10907",
                "8901234567818",
                "RFID-10907-R",
                "High-speed 20W PowerIQ 3.0 portable battery charger for laptops & phones.",
                59.99,
                19,
                15,
                35,
                "Warning",
                "Tech Hub",
                "https://images.unsplash.com/photo-1609592424074-27f9175390e1?w=400&auto=format&fit=crop&q=80",
                8.1,
                catElectronics,
                supTech
        ));

        // 4. Automated Reorder Pipeline
        purchaseOrderRepository.save(new PurchaseOrder("PO #78912", supTech, p2, 25, 2499.75, "SENT", "ETA: 2 days"));
        purchaseOrderRepository.save(new PurchaseOrder("PO #78905", supGreenPack, p6, 40, 1120.00, "IN_TRANSIT", "ETA: 3 days"));
        purchaseOrderRepository.save(new PurchaseOrder("PO #78890", supEco, p14, 50, 925.00, "DELIVERED", "Received 1 day ago"));

        // 5. Initial Stock Transactions
        transactionRepository.save(new StockTransaction(p1, "STOCK_OUT", 5, "Warehouse A", "Store Front", "Online customer sales"));
        transactionRepository.save(new StockTransaction(p5, "STOCK_IN", 50, "Supplier", "Store B", "Restock shipment received"));
        transactionRepository.save(new StockTransaction(p8, "STOCK_OUT", 18, "Warehouse A", "Store A", "Stock depleted"));

        System.out.println(">>> StockSmart 18 Premium Retail Products Successfully Populated!");
    }
}

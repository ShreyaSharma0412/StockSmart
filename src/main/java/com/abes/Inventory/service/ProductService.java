package com.abes.Inventory.service;

import com.abes.Inventory.model.Product;
import com.abes.Inventory.model.StockTransaction;
import com.abes.Inventory.repository.ProductRepository;
import com.abes.Inventory.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final StockTransactionRepository transactionRepository;

    public ProductService(ProductRepository repository, StockTransactionRepository transactionRepository) {
        this.repository = repository;
        this.transactionRepository = transactionRepository;
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Optional<Product> getProductById(Integer id) {
        return repository.findById(id);
    }

    public Product addProduct(Product product) {
        if (product.getSku() == null || product.getSku().trim().isEmpty()) {
            product.setSku("SKU-" + (int)(Math.random() * 89999 + 10000));
        }
        if (product.getBarcode() == null || product.getBarcode().trim().isEmpty()) {
            product.setBarcode("890" + (long)(Math.random() * 8999999999L + 1000000000L));
        }
        if (product.getRfidTag() == null || product.getRfidTag().trim().isEmpty()) {
            product.setRfidTag("RFID-" + (int)(Math.random() * 89999 + 10000) + "-X");
        }
        if (product.getQuantity() == null) {
            product.setQuantity(10);
        }
        if (product.getMinStockLevel() == null) {
            product.setMinStockLevel(15);
        }
        if (product.getReorderQuantity() == null) {
            product.setReorderQuantity(50);
        }
        if (product.getTurnoverRate() <= 0) {
            product.setTurnoverRate(5.0);
        }
        if (product.getImageUrl() == null || product.getImageUrl().trim().isEmpty()) {
            product.setImageUrl("https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80");
        }
        updateProductStatus(product);
        return repository.save(product);
    }

    public Product updateProduct(Integer id, Product product) {
        Product existingProduct = repository.findById(id).orElse(null);

        if (existingProduct != null) {
            existingProduct.setName(product.getName());
            existingProduct.setSku(product.getSku());
            existingProduct.setBarcode(product.getBarcode());
            existingProduct.setRfidTag(product.getRfidTag());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setQuantity(product.getQuantity());
            existingProduct.setMinStockLevel(product.getMinStockLevel());
            existingProduct.setReorderQuantity(product.getReorderQuantity());
            existingProduct.setLocation(product.getLocation());
            existingProduct.setImageUrl(product.getImageUrl());
            existingProduct.setTurnoverRate(product.getTurnoverRate());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setSupplier(product.getSupplier());

            updateProductStatus(existingProduct);
            return repository.save(existingProduct);
        }

        return null;
    }

    @Transactional
    public Product adjustStock(Integer id, Integer quantityDelta, String type, String remarks, String sourceLoc, String destLoc) {
        Product product = repository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
        int newQty = Math.max(0, currentQty + quantityDelta);
        product.setQuantity(newQty);
        updateProductStatus(product);

        Product savedProduct = repository.save(product);

        StockTransaction tx = new StockTransaction(
                savedProduct,
                type,
                Math.abs(quantityDelta),
                sourceLoc != null ? sourceLoc : savedProduct.getLocation(),
                destLoc != null ? destLoc : savedProduct.getLocation(),
                remarks
        );
        transactionRepository.save(tx);

        return savedProduct;
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return repository.findAll();
        }
        return repository.searchProducts(query.trim());
    }

    public Optional<Product> findByBarcode(String barcode) {
        return repository.findByBarcode(barcode);
    }

    public Optional<Product> findByRfid(String rfid) {
        return repository.findByRfidTag(rfid);
    }

    public List<Product> getLowStockProducts() {
        return repository.findLowStockProducts();
    }

    public void updateProductStatus(Product product) {
        if (product.getQuantity() == null || product.getQuantity() == 0) {
            product.setStatus("Out of Stock");
        } else if (product.getMinStockLevel() != null && product.getQuantity() <= product.getMinStockLevel()) {
            product.setStatus("Low Stock");
        } else if (product.getQuantity() <= 20) {
            product.setStatus("Warning");
        } else {
            product.setStatus("In Stock");
        }
    }
}
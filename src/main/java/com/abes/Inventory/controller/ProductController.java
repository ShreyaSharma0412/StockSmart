package com.abes.Inventory.controller;

import com.abes.Inventory.model.Product;
import com.abes.Inventory.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Get all products or search
    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return productService.searchProducts(search);
        }
        return productService.getAllProducts();
    }

    // Get low stock products
    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return productService.getLowStockProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lookup product by Barcode or RFID
    @GetMapping("/scan")
    public ResponseEntity<Product> scanProduct(@RequestParam(required = false) String code) {
        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return productService.findByBarcode(code)
                .or(() -> productService.findByRfid(code))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add new product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    // Update existing product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    // Stock adjustment endpoint
    @PostMapping("/{id}/adjust-stock")
    public ResponseEntity<Product> adjustStock(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> payload) {
        Integer delta = ((Number) payload.getOrDefault("quantityDelta", 0)).intValue();
        String type = (String) payload.getOrDefault("type", "STOCK_IN");
        String remarks = (String) payload.getOrDefault("remarks", "Manual adjustment");
        String sourceLoc = (String) payload.get("sourceLocation");
        String destLoc = (String) payload.get("destinationLocation");

        Product updated = productService.adjustStock(id, delta, type, remarks, sourceLoc, destLoc);
        return ResponseEntity.ok(updated);
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        if (productService.getProductById(id).isPresent()) {
            // Note: repository delete can be called via productService or repo
            productService.getProductById(id).ifPresent(p -> {
                // delete logic
            });
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
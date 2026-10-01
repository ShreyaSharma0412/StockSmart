package com.abes.Inventory.controller;

import com.abes.Inventory.model.Product;
import com.abes.Inventory.model.PurchaseOrder;
import com.abes.Inventory.repository.ProductRepository;
import com.abes.Inventory.repository.PurchaseOrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;

    public PurchaseOrderController(PurchaseOrderRepository purchaseOrderRepository, ProductRepository productRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @PostMapping("/reorder/{productId}")
    public ResponseEntity<PurchaseOrder> triggerReorder(@PathVariable Integer productId, @RequestBody(required = false) Map<String, Object> body) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        int qty = product.getReorderQuantity() != null && product.getReorderQuantity() > 0 ? product.getReorderQuantity() : 50;
        if (body != null && body.containsKey("quantity")) {
            qty = ((Number) body.get("quantity")).intValue();
        }

        String poNum = "PO #" + (78900 + new Random().nextInt(1000));
        PurchaseOrder po = new PurchaseOrder(
                poNum,
                product.getSupplier(),
                product,
                qty,
                product.getPrice() * qty,
                "SENT",
                "ETA: 3 days"
        );

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PurchaseOrder> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusMap) {
        String newStatus = statusMap.get("status");
        return purchaseOrderRepository.findById(id).map(po -> {
            po.setStatus(newStatus);
            if ("DELIVERED".equalsIgnoreCase(newStatus)) {
                po.setEta("Received just now");
                // restock product
                if (po.getProduct() != null) {
                    Product p = po.getProduct();
                    p.setQuantity((p.getQuantity() != null ? p.getQuantity() : 0) + po.getQuantity());
                    p.setStatus("In Stock");
                    productRepository.save(p);
                }
            }
            return ResponseEntity.ok(purchaseOrderRepository.save(po));
        }).orElse(ResponseEntity.notFound().build());
    }
}

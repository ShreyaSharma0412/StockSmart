package com.abes.Inventory.repository;

import com.abes.Inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Optional<Product> findBySku(String sku);

    Optional<Product> findByBarcode(String barcode);

    Optional<Product> findByRfidTag(String rfidTag);

    List<Product> findByCategoryId(Integer categoryId);

    List<Product> findByStatus(String status);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.barcode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.rfidTag) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE p.quantity <= p.minStockLevel OR p.status = 'Low Stock' OR p.status = 'Out of Stock'")
    List<Product> findLowStockProducts();
}
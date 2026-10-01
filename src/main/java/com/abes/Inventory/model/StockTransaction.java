package com.abes.Inventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transaction")
public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String type; // "STOCK_IN", "STOCK_OUT", "TRANSFER", "AUDIT"

    private Integer quantity;

    private String sourceLocation;

    private String destinationLocation;

    private LocalDateTime transactionDate;

    private String remarks;

    public StockTransaction() {
    }

    public StockTransaction(Product product, String type, Integer quantity, String sourceLocation, String destinationLocation, String remarks) {
        this.product = product;
        this.type = type;
        this.quantity = quantity;
        this.sourceLocation = sourceLocation;
        this.destinationLocation = destinationLocation;
        this.remarks = remarks;
    }

    @PrePersist
    public void setTransactionDateBeforeSave() {
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getSourceLocation() {
        return sourceLocation;
    }

    public void setSourceLocation(String sourceLocation) {
        this.sourceLocation = sourceLocation;
    }

    public String getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(String destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
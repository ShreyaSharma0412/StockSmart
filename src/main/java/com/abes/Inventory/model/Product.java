package com.abes.Inventory.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(unique = true)
    private String sku;

    private String barcode;

    private String rfidTag;

    @Column(length = 1000)
    private String description;

    private Double price = 0.0;

    private Integer quantity;

    private Integer minStockLevel;

    private Integer reorderQuantity;

    private String status; // "In Stock", "Low Stock", "Out of Stock", "Warning"

    private String location; // e.g. "Warehouse A", "Store B"

    private String imageUrl;

    private Double turnoverRate = 0.0; // e.g., 4.2

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    public Product() {
    }

    public Product(String name, String sku, String barcode, String rfidTag, String description,
                   Double price, Integer quantity, Integer minStockLevel, Integer reorderQuantity,
                   String status, String location, String imageUrl, Double turnoverRate,
                   Category category, Supplier supplier) {
        this.name = name;
        this.sku = sku;
        this.barcode = barcode;
        this.rfidTag = rfidTag;
        this.description = description;
        this.price = price != null ? price : 0.0;
        this.quantity = quantity;
        this.minStockLevel = minStockLevel;
        this.reorderQuantity = reorderQuantity;
        this.status = status;
        this.location = location;
        this.imageUrl = imageUrl;
        this.turnoverRate = turnoverRate != null ? turnoverRate : 0.0;
        this.category = category;
        this.supplier = supplier;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getRfidTag() {
        return rfidTag;
    }

    public void setRfidTag(String rfidTag) {
        this.rfidTag = rfidTag;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price != null ? price : 0.0;
    }

    public void setPrice(Double price) {
        this.price = price != null ? price : 0.0;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public Integer getReorderQuantity() {
        return reorderQuantity;
    }

    public void setReorderQuantity(Integer reorderQuantity) {
        this.reorderQuantity = reorderQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getTurnoverRate() {
        return turnoverRate != null ? turnoverRate : 0.0;
    }

    public void setTurnoverRate(Double turnoverRate) {
        this.turnoverRate = turnoverRate != null ? turnoverRate : 0.0;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public double getTotalValue() {
        return this.quantity != null ? this.quantity * this.price : 0.0;
    }
}
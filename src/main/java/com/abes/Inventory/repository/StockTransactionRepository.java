package com.abes.Inventory.repository;

import com.abes.Inventory.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Integer> {
    List<StockTransaction> findByProductId(Integer productId);
    List<StockTransaction> findTop20ByOrderByTransactionDateDesc();
}

package com.abes.Inventory.controller;

import com.abes.Inventory.model.StockTransaction;
import com.abes.Inventory.repository.StockTransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class StockTransactionController {

    private final StockTransactionRepository transactionRepository;

    public StockTransactionController(StockTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public List<StockTransaction> getAllTransactions() {
        return transactionRepository.findTop20ByOrderByTransactionDateDesc();
    }

    @GetMapping("/product/{productId}")
    public List<StockTransaction> getTransactionsByProduct(@PathVariable Integer productId) {
        return transactionRepository.findByProductId(productId);
    }
}

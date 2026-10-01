package com.abes.Inventory.service;

import com.abes.Inventory.model.Supplier;
import com.abes.Inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(Integer id) {
        return supplierRepository.findById(id);
    }

    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Optional<Supplier> updateSupplier(Integer id, Supplier supplier) {
        return supplierRepository.findById(id).map(existing -> {
            existing.setName(supplier.getName());
            existing.setEmail(supplier.getEmail());
            existing.setPhone(supplier.getPhone());
            existing.setAddress(supplier.getAddress());
            existing.setCode(supplier.getCode());
            existing.setRating(supplier.getRating());
            existing.setLeadTimeDays(supplier.getLeadTimeDays());
            return supplierRepository.save(existing);
        });
    }

    public boolean deleteSupplier(Integer id) {
        if (!supplierRepository.existsById(id)) {
            return false;
        }
        supplierRepository.deleteById(id);
        return true;
    }
}

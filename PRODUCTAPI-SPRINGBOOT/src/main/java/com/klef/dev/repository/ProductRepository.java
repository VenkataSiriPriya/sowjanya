package com.klef.dev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.dev.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> 
{
    Product findByName(String name);
    Product findByCategory(String category);
}

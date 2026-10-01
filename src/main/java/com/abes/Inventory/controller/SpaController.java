package com.abes.Inventory.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SpaController {

    // Forward non-API routes to index.html for Angular single page application routing
    @GetMapping({
        "/",
        "/login",
        "/signup",
        "/inventory",
        "/dashboard",
        "/scanner",
        "/suppliers",
        "/reports"
    })
    public String forward() {
        return "forward:/index.html";
    }
}

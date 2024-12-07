#include "Inventory.h"
#include <iostream>
using namespace std;

// Function to add a new product to the inventory
void Inventory::addProduct(int id, string name, int quantity, double price) {
    Product newProduct(id, name, quantity, price);
    products.push_back(newProduct);
    cout << "Product added successfully!" << endl;
}

// Function to update product details by product ID
void Inventory::updateProduct(int id, int newQuantity, double newPrice) {
    for (auto &product : products) {
        if (product.id == id) {
            product.quantity = newQuantity;
            product.price = newPrice;
            cout << "Product updated successfully!" << endl;
            return;
        }
    }
    cout << "Product not found!" << endl;
}

// Function to search for a product by its ID
void Inventory::searchProduct(int id) {
    for (const auto &product : products) {
        if (product.id == id) {
            cout << "Product Found!" << endl;
            cout << "ID: " << product.id << endl;
            cout << "Name: " << product.name << endl;
            cout << "Quantity: " << product.quantity << endl;
            cout << "Price: $" << product.price << endl;
            return;
        }
    }
    cout << "Product not found!" << endl;
}

// Function to display all products in the inventory
void Inventory::displayInventory() {
    if (products.empty()) {
        cout << "Inventory is empty!" << endl;
        return;
    }
    cout << "All Products in Inventory:" << endl;
    for (const auto &product : products) {
        cout << "ID: " << product.id << " | Name: " << product.name
             << " | Quantity: " << product.quantity
             << " | Price: $" << product.price << endl;
    }
}

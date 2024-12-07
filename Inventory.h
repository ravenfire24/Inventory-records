#ifndef INVENTORY_H
#define INVENTORY_H

#include "Product.h"
#include <vector>
using namespace std;

// Class Inventory
class Inventory {
private:
    vector<Product> products;

public:
    void addProduct(int id, string name, int quantity, double price);
    void updateProduct(int id, int newQuantity, double newPrice);
    void searchProduct(int id);
    void displayInventory();
};

#endif 

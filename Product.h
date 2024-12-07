#ifndef PRODUCT_H
#define PRODUCT_H

#include <string>
using namespace std;

// Class to represent a Product in the inventory
class Product {
public:
    int id;
    string name;
    int quantity;
    double price;

    Product(int _id, string _name, int _quantity, double _price);
};

#endif 

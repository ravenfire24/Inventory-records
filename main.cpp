#include "Inventory.h"
#include <iostream>
using namespace std;

int main() {
    Inventory inventory;
    int choice;
    int id, quantity;
    double price;
    string name;

    do {
        cout << "\n--- Inventory Management System ---\n";
        cout << "1. Add Product\n";
        cout << "2. Update Product\n";
        cout << "3. Search Product\n";
        cout << "4. Display Inventory\n";
        cout << "5. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:                
                cout << "Enter Product ID: ";
                cin >> id;
                cout << "Enter Product Name: ";
                cin.ignore();  
                getline(cin, name);
                cout << "Enter Product Quantity: ";
                cin >> quantity;
                cout << "Enter Product Price: ";
                cin >> price;
                inventory.addProduct(id, name, quantity, price);
                break;

            case 2:                
                cout << "Enter Product ID to update: ";
                cin >> id;
                cout << "Enter new Quantity: ";
                cin >> quantity;
                cout << "Enter new Price: ";
                cin >> price;
                inventory.updateProduct(id, quantity, price);
                break;

            case 3:                
                cout << "Enter Product ID to search: ";
                cin >> id;
                inventory.searchProduct(id);
                break;

            case 4:               
                inventory.displayInventory();
                break;

            case 5:
                cout << "Exiting Inventory Management System...\n";
                break;

            default:
                cout << "Invalid choice! Please try again.\n";
                break;
        }
    } while (choice != 5);

    return 0;
}

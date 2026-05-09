#ifndef BANK_H
#define BANK_H

#include<iostream>
#include<vector>
#include<exception>
#include<string>
#include<memory>
#include <map>
#include"bank_customer.h"

class Bank {
    std::string name;
    std::map<unsigned, std::shared_ptr<Customer>> customers;
public:
    Bank(std::string name): name(name){
        if(name.empty()) throw std::runtime_error("There is no name of bank");
    }

    const std::map<unsigned, std::shared_ptr<Customer>>& get_customers() const{
        return customers;
    }

    void create_customer(std::string name, std::string acc_name, int dispo, int amount, Account_Type type = Account_Type::STANDARD, int fee = 0){
        auto c = std::make_shared<Customer>(name);
        c->create_account(acc_name, dispo, amount, type, fee);
        customers[c->get_id()] = c;
    }

    friend std::ostream& operator<<(std::ostream& o, const Bank& b);
};

inline std::ostream& operator<<(std::ostream& o, const Bank& b){
    o << "[" << b.name << ", {";

    bool first{true};
    for (const auto& [id, cust] : b.customers) {
        if (!first) o << ", ";
        first = false;
        o << *cust;
    }
    o << "}]";
    return o;
}

#endif
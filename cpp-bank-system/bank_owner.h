#ifndef BANK_OWNER_H
#define BANK_OWNER_H

#include<iostream>
#include<vector>
#include<exception>
#include<string>
#include<memory>
#include <map>
#include"bank_customer.h"
#include"bank.h"



class Bank_Owner {
    std::string name;
    std::unique_ptr<Bank> bank;
public:
    Bank_Owner(std::string name):name(name){
        if(name.empty()) throw std::runtime_error("There is no name of bank owner");
    }

    bool create_bank(std::string name){
        if (bank) return false;
        bank = std::make_unique<Bank>(name);
        return true;
    }

    bool transfer_bank(Bank_Owner& target){
        if (!bank) return false;
        if (target.bank) return false;

        target.bank = std::move(this->bank);
        return true;
    }

    const std::map<unsigned, std::shared_ptr<Customer>>& get_customers() const{
        if (!bank) throw std::runtime_error("there is no bank");
        return bank->get_customers();
    }

    void create_customer(std::string name,std::string acc_name,int dispo, int amount, Account_Type type = Account_Type::STANDARD, int fee = 0){
        if (!bank) throw std::runtime_error("there is no bank");
        bank->create_customer(name, acc_name, dispo, amount, type, fee);
    }
    friend std::ostream& operator<<(std::ostream& o, const Bank_Owner & bo);
};

inline std::ostream& operator<<(std::ostream& o, const Bank_Owner & bo){
    o << "[" << bo.name << "";
    if (bo.bank) o << ", " << *bo.bank << "]";
    else o << "]";
    return o;
}

#endif
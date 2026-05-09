#ifndef BANK_CUSTOMER_H
#define BANK_CUSTOMER_H

#include<iostream>
#include<vector>
#include<exception>
#include<string>
#include<memory>
#include<map>
#include"bank_account.h"


class Customer : public std::enable_shared_from_this<Customer>{
    unsigned id;
    std::string name;
    std::map<unsigned, std::shared_ptr<Account>> accounts;
    inline static unsigned next_id = 0;
public:
    Customer(std::string name): name(name){
        if(name.empty()) throw std::runtime_error("There is no name of customer");

        id = next_id;
        next_id++;
    }

    unsigned create_account(std::string acc_name,int dispo, int amount, Account_Type type = Account_Type::STANDARD, int fee = 0){

        std::shared_ptr<Customer> self = shared_from_this();

        std::shared_ptr<Account> acc;

        if (type == Account_Type::SPECIAL) {
            acc = std::make_shared<Special_Account>(acc_name, dispo, amount, self, fee);
        } else {
            acc = std::make_shared<Standard_Account>(acc_name, dispo, amount, self);
        }

        accounts[acc->get_id()] = acc;
        return acc->get_id();
    }

    int total_amount() const{
        int sum{0};
        for (const auto& a : accounts){
            sum += a.second->get_amount();
        }
        return sum;
    }

    unsigned get_id() const {
        return id;
    }

    const std::string& get_name() const{
        return name;
    }

    const std::map<unsigned,std::shared_ptr<Account>>& get_accounts() const {
        return accounts;
    }

    bool share_account(unsigned aid, std::shared_ptr<Customer> new_owner){
        if (!new_owner)
            return false;

        std::shared_ptr<Account> acc = nullptr;

        for (auto& a : accounts) {
            if (a.second->get_id() == aid) {
                acc = a.second;
                break;
            }
        }

        if (!acc) return false;

        auto [it, inserted] = new_owner->accounts.emplace(acc->get_id(), acc);
        if (!inserted) return false;

        acc->share_account(new_owner);
        return true;
    }

    bool transfer(int amount,unsigned source_id, std::shared_ptr<Customer> target,unsigned target_id){

        if (!target) return false;

        if(accounts.find(source_id) == accounts.end()) return false;

        if(target->accounts.find(target_id) == target->accounts.end()) return false;

        if(source_id == target_id){
            throw std::runtime_error("Both ids are same");
        }
        try{
            accounts[source_id]->withdraw(amount);
            target->accounts[target_id]->deposit(amount);
        } catch (const std::exception& e){
            return false;
        }
        return true;
    }

    friend std::ostream& operator<<(std::ostream& o, const Customer& p);

};



inline std::ostream& operator<<(std::ostream& o, const Customer& p) {
    o << "[" << p.get_name() << ", {";

    bool first = true;

    for (const auto& [id, acc] : p.accounts) {
        if (!first) o << ", ";
        first = false;
        acc->print_short(o);
    }
    o << "}, " << p.total_amount() << "]";
    return o;
}

#endif
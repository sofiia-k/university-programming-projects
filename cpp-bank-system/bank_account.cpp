#include<iostream>
#include<vector>
#include<exception>
#include<string>
#include<memory>
#include <map>

#include"bank_account.h"
#include"bank_customer.h"

std::ostream& operator<<(std::ostream& o, const Account& p) { 
    o << "[" << p.get_name() << ", " << p.additional_output() << ", " << p.get_amount() << ", " << p.get_dispo() << ", {"; 
    bool first = true; 
    for (const auto& [cid, wptr] : p.owners) {
        if (auto sp = wptr.lock()) {
             if (!first) o << ", "; 
             first = false; 
            o << '[' << sp->get_name() << ", " << sp->total_amount() << ']';
        } 
    } 
    o << "}, " << p.owner_count() << ']'; 
    return o; 
}

Account::Account(std::string name, int dispo, int amount, std::shared_ptr<Customer> owner):name(name), dispo(dispo), amount(amount){
    if(name.empty()) throw std::runtime_error("There is no name");
    if(dispo <= 0 || dispo >= 10000) throw std::runtime_error("dispo is not in range");
    if(amount < -1 * dispo) throw std::runtime_error("amount is not in range");
    if(owner == nullptr) throw std::runtime_error("no owner");

    id = next_id;
    next_id++;

    unsigned cid = owner->get_id();
    owners[cid] = std::weak_ptr<Customer>(owner);
}



bool Account::share_account(std::shared_ptr<Customer> new_owner) {
    if (!new_owner) return false;

    unsigned cid = new_owner->get_id();
    auto [it, inserted] = owners.emplace(cid, std::weak_ptr<Customer>(new_owner));

    return inserted;
}
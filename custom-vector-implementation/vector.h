#ifndef VECTOR_H
#define VECTOR_H

#include<iostream>
#include<stdexcept>
#include<initializer_list>


template <typename T>

class Vector{
public:
    // using declaration (we are adding them to have a possibility to use STL-algorithms)
    class ConstIterator;
    class Iterator;
    using value_type = T;
    using size_type = std::size_t;
    using difference_type = std::ptrdiff_t;
    using reference = value_type&;
    using const_reference = const value_type&;
    using pointer = value_type*;
    using const_pointer = const value_type*;
    using iterator = Vector::Iterator;
    using const_iterator = Vector::ConstIterator;

private:
    size_type sz;
    size_type max_sz;
    pointer values;

    void allocate(size_type new_max_sz){
        pointer help {new value_type[new_max_sz]};
        for (size_type i {0}; i < sz; i++)
            help[i] = values[i];
        delete[] values;
        values = help;
        max_sz = new_max_sz;
    }

    friend class Iterator;
    friend class ConstIterator;
public:
    Vector(): sz{0}, max_sz{0}, values{nullptr} {};

    Vector(size_type n): sz{0}, max_sz{n}, values{nullptr} {
        if (n > 0){
           values = new value_type[max_sz];
        }
    }

    Vector(const Vector& other): sz{other.sz}, max_sz{other.max_sz}, values{new value_type[max_sz]} {
        for(size_type i {0}; i < sz; i++)
            values[i] = other.values[i];
    }

    Vector(std::initializer_list<value_type> li): Vector(li.size()){
        for (const auto& i : li) {
            values[sz++] = i;
        }
    }

    ~Vector() {
        delete[] values;
    }

    Vector& operator=(Vector other){
        std::swap(sz, other.sz);
		std::swap(max_sz, other.max_sz);
		std::swap(values, other.values);
		return *this;
    }

    size_type size() const {return sz;}

    bool empty() const{
        return sz == 0;
    }

    void clear(){
        sz = 0;
    }

    void reserve(size_type n){
        if (max_sz < n) 
            allocate(n);
    }

    void shrink_to_fit(){
        allocate(sz);
    }

    void push_back(value_type x){
        if (sz == max_sz){
            allocate(max_sz*2 + 1);
        }
        values[sz++] = x;
    }

    void pop_back() {
        if (sz == 0) throw std::runtime_error("Vector is empty");
        --sz;
    }

    reference operator[](size_type index){
        if (index >= sz) throw std::runtime_error("Out of bounds");
        return values[index];
    }

    const_reference operator[](size_type index) const{
        if (index >= sz) throw std::runtime_error("Out of bounds");
        return values[index];
    }

    size_type capacity() const{return max_sz;}

    friend std::ostream& operator<<(std::ostream& o, const Vector& v){
        o << "[";
        bool first {true};
        for (size_type i{0}; i < v.sz; i++){
            if (first) first = false;
            else o << ", ";
            o << v.values[i];
        }
        o << "]";
        return o;
    }

    iterator begin(){
        return iterator(values);
    }

    iterator end(){
        return iterator(values + sz);
    }

    const_iterator begin() const{
        return const_iterator(values);
    }

    const_iterator end() const{
        return const_iterator(values + sz);
    }

    class Iterator{
        public:
            using value_type = Vector::value_type;
            using reference = Vector::reference;
            using pointer = Vector::pointer;
            using difference_type = Vector::difference_type;
            using iterator_category = std::forward_iterator_tag;
        
        private:
            pointer ptr;
            friend class ConstIterator;
            friend class Vector;
        public:
            Iterator(): ptr(nullptr) {}

            Iterator(pointer p): ptr(p) {}

            operator const_iterator() const {
                return const_iterator(ptr);
            }
            
            reference operator*() const {
                if (ptr == nullptr) 
                    throw std::runtime_error("Cannot dereference null or end iterator");
                return *ptr;
            }

            pointer operator->() const {
                if (ptr == nullptr) 
                    throw std::runtime_error("Cannot dereference null or end iterator");
                return ptr;
            }

            bool operator==(const const_iterator& it) const{
                return ptr == it.ptr;
            }

            bool operator!=(const const_iterator& it) const{
                return ptr != it.ptr;
            }

            iterator& operator++() {
                if (ptr != nullptr) 
                    ++ptr;
                return *this;
            }

            iterator operator++(int x) {
                iterator help(ptr);
                if (ptr != nullptr)
                    ++ptr;
                return help;
            }

    };

    class ConstIterator{
        public:
            using value_type = Vector::value_type;
            using reference = Vector::const_reference;
            using pointer = Vector::const_pointer;
            using difference_type = Vector::difference_type;
            using iterator_category = std::forward_iterator_tag;
        
        private:
            pointer ptr;
            friend class Iterator;
            friend class Vector;
        public:
            ConstIterator(): ptr(nullptr) {}

            ConstIterator(pointer p): ptr(p) {}

            reference operator*() const {
                if (ptr == nullptr) 
                    throw std::runtime_error("Cannot dereference null or end iterator");
                return *ptr;
            }

            pointer operator->() const {
                if (ptr == nullptr) 
                    throw std::runtime_error("Cannot dereference null or end iterator");
                return ptr;
            }

            bool operator==(const const_iterator& it) const {
                return ptr == it.ptr;
            }

            bool operator!=(const const_iterator& it) const {
                return ptr != it.ptr;
            }

            const_iterator& operator++() {
                if (ptr != nullptr) 
                    ++ptr;
                return *this;
            }

            const_iterator operator++(int x) {
                const_iterator help(ptr);
                if (ptr != nullptr)
                    ++ptr;
                return help;
            }
    };

    friend Vector::difference_type operator-(const Vector::ConstIterator& lop, const Vector::ConstIterator& rop){
        return lop.ptr - rop.ptr;
    }

    iterator insert(const_iterator pos, const_reference val) {
        auto diff = pos - begin();
        if (diff < 0 || static_cast<size_type>(diff) > sz)
            throw std::runtime_error("Iterator out of bounds");
        size_type current{static_cast<size_type>(diff)};
        if (sz >= max_sz)
            reserve(max_sz * 2 + 1); // Achtung Sonderfall, wenn keine Mindestgroesze definiert ist
        for (auto i{sz}; i-- > current;)
            values[i + 1] = values[i];
        values[current] = val;
        ++sz;
        return iterator{values + current};
    }

    iterator erase(const_iterator pos) {
        auto diff = pos - begin();
        if (diff < 0 || static_cast<size_type>(diff) >= sz)
            throw std::runtime_error("Iterator out of bounds");
        size_type current{static_cast<size_type>(diff)};
        for (auto i{current}; i < sz - 1; ++i)
            values[i] = values[i + 1];
        --sz;
        return iterator{values + current};
    }
    
};

#endif
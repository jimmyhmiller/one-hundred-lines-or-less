(ns object-system.core
  (:require [clojure.string :as string]))

(defn dispatcher [obj message & args] 
  (apply (message obj)
         (cons (partial dispatcher obj) args)))

(defn class [obj]
  (partial dispatcher obj))

(defn get-methods [obj]
  (obj constantly))

(defn method-names [obj]
  (keys (get-methods obj)))

(defn extend-object [obj extension]
  (let [methods (get-methods obj)]
    (class (merge methods extension))))

(defn inherit [base-class my-class]
  (extend-object base-class my-class))

(comment

  (def Animal
    (class {:isAnimal (fn [this] true)}))

  (def Dog
    (inherit Animal {:speaks (fn [this] "Bark")}))

  (def Insert)
  (def Union)

  (def Empty
    (class {:isEmpty (fn [this] true)
            :contains (fn [this i] false)
            :insert (fn [this i] (Insert this i))
            :union (fn [this s] s)}))

  (defn Insert [s n]
    (if (s :contains n)
      s
      (class
       {:isEmpty (fn [this] false)
        :contains (fn [this i] (or (= i n) (s :contains i)))
        :insert (fn [this i] (Insert this i))
        :union (fn [this s] (Union this s))})))

  (defn Counter [initial-count]
    (let [count (atom initial-count)]
      (class {:increment (fn [this] (swap! count inc))
              :get-count (fn [this] @count)})))

  (def counter (Counter 12))

  (def super-counter 
    (extend-object 
     counter
     {:inc-3 (fn [this] 
               (this :increment)
               (this :increment)
               (this :increment))}))

  (counter :get-count)

  (super-counter :inc-3)
  )

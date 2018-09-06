(ns pattern-matcher.core
  (:require [unifier.core :as unifier]))

(defn matcher [value]
  (fn [pattern]
    (unifier/unify {} value pattern)))

(defn first-match [value patterns]
  (->> (partition 2 patterns)
       (map (juxt (comp (matcher value) first) second))
       (filter (comp (complement unifier/failed?) first))
       (first)))

(defn match* [value patterns]
  (unifier/substitute (first-match value patterns)))

(defmacro match [value & patterns]
  `(eval (match* ~value (quote ~patterns))))

(defmacro defmatch [name & patterns]
  `(defn ~name [& args#]
     (match args# ~@patterns)))


(comment
  (match true
         true false
         false true)

  (match :name
         :otherName :otherThing
         :name :thing)


  (match [1 2 3]
         [?x]       {:x ?x}
         [?x ?y]    {:x ?x :y ?y}
         [?x ?y ?z] {:x ?x :y ?y :z ?z})


  (match [1 2 1]
         [?x ?y ?x] {:x ?x :y ?y}
         [?x ?y ?z] {:x ?x :y ?y :z ?z})


  (defmatch fib
    [0] 0
    [1] 1
    [?n] (+ (fib (- ?n 1))
            (fib (- ?n 2))))


  (fib 5)
  (fib 10)

  (defmatch get-x
    [?x] ?x
    [?x ?y] ?x
    [?x ?y ?z] ?x)

  (get-x 1)
  (get-x 1 2)
  (get-x 1 2 3))

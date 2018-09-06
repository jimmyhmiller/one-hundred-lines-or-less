(ns query-engine.core
  (:require [unifier.core :as unifier]))

(defn match-clause [clause facts env]
  (->> facts
       (map (partial unifier/unify env clause))
       (filter (complement unifier/failed?))))

(defn match-all [clause facts envs]
  (mapcat (partial match-clause clause facts) envs))

(defn process-query [clauses facts envs]
  (if (empty? clauses)
    envs
    (recur (rest clauses)
           facts
           (match-all (first clauses) facts envs))))

(defn q* [{:keys [find where]} db]
  (let [envs (process-query where db [{}])]
    (map unifier/substitute (map vector envs (repeat find)))))

(defmacro q [query db]
  `(q* (quote ~query) db))


(comment

  (def db
    [[1 :age 26]
     [1 :name "jimmy"]
     [2 :age 26]
     [2 :name "steve"]
     [3 :age 24]
     [3 :name "bob"]
     [4 :address 1]
     [4 :address-line-1 "123 street st"]
     [4 :city "Indianapolis"]])

  

  (q {:find {:name ?name}
      :where [[?_ :name ?name]]}
     db)


  (q {:find {:name ?name
             :age ?age}
      :where [[?e :name ?name]
              [?e :age ?age]]}
     db)




  (q {:find {:name1 ?name1
             :name2 ?name2}
      :where [[?e1 :name ?name1]
              [?e2 :name ?name2]
              [?e1 :age ?age]
              [?e2 :age ?age]]}
     db)



  (q {:find {:name ?name
             :address-line-1 ?address-line-1
             :city ?city}
      :where [[?e :name ?name]
              [?a :address ?e]
              [?a :address-line-1 ?address-line-1]
              [?a :city ?city]]}
     db))

(ns fizz-buzz.core)

(def TRUE (fn [t f] t))
(def FALSE (fn [t f] f))
(def IF (fn [pred t f] (pred t f)))

(def AND 
  (fn [a b]
    (IF a (IF b TRUE FALSE) FALSE)))

(defn is-zero? [n]
  (nth (cons TRUE (repeat FALSE)) n))

(defn evenly-divisible? [n m]
  (is-zero? (mod n m)))

(defn COND [p1 t1 p2 t2 p3 t3 _ e]
  (IF p1 t1 (IF p2 t2 (IF p3 t3 e))))

(defn fizz [n]
  (COND 
   (AND (evenly-divisible? n 3)
        (evenly-divisible? n 5)) "FizzBuzz"
   (evenly-divisible? n 3)  "Fizz"
   (evenly-divisible? n 5) "Buzz" 
   :else n))


(map fizz (range 1 101))

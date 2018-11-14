from functools import partial
import cProfile

def pbm_header(rows):
    cols = rows * 2 + 1
    return "P1\n{} {}\n".format(cols, rows)

def initial_row(rows):
    return "0" * rows + "1" + "0" * rows

def num_to_binary(num):
    return list(format(num, "08b"))

combinations = ["111","110", "101", "100", "011", "010", "001", "000"]

def find_rule(num):
    return dict(zip(combinations, num_to_binary(num)))

def apply_rule(rule, row):
    padded_row = "0" + row + "0"
    return "".join(rule[padded_row[i:i+3]] for i in range(0, len(row)))

def display_row(row):
    return " ".join(row)

def format_rows(generated_rows):
    return "\n".join(map(display_row, generated_rows))

def iterate(f, x):
    while True:
        yield x
        x = f(x)

def take(coll, n):
    return [next(coll) for _ in range(n)]

def generate_rows(rows, rule):
    current_rule = partial(apply_rule, find_rule(rule))
    return take(iterate(current_rule, initial_row(rows)), rows)

def generate_pbm(rows, rule):
    generated_rows = generate_rows(rows, rule)
    header = pbm_header(rows)
    return "{}\n{}".format(header, format_rows(generated_rows))

def write_pbm(rows, rule):
    with open(str(rule) + ".pbm", "w") as f:
        f.write(generate_pbm(rows, rule))

def main():
    rows = 500
    for rule in range(1,256):
        write_pbm(rows, rule)

if __name__ == '__main__':
    main()


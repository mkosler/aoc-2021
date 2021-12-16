module.exports = class MinHeap {
  constructor(selector) {
    this.items = [];
    this.selector = selector;
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.size === 0;
  }

  insert(n) {
    let i = this.items.length;
    let pi = Math.max(Math.floor((i + 1) / 2 - 1), 0);

    this.items.push(n);

    const iv = this.selector(this.items[i]);
    let pv = this.selector(this.items[pi]);

    while (i > 0 && pv > iv) {
      pi = Math.floor((i + 1) / 2 - 1);

      [this.items[i], this.items[pi]] = [this.items[pi], this.items[i]];

      i = pi;
      pv = this.selector(this.items[Math.max(Math.floor((i + 1) / 2 - 1), 0)]);
    }
  }

  remove() {
    if (this.items.length <= 1) return this.items.pop();

    const ret = this.items[0];

    [this.items[0], this.items[this.items.length - 1]] = [this.items[this.items.length - 1], this.items[0]];
    this.items.pop();

    let i = 0;

    while (true) {
      let right = (i + 1) * 2;
      let left = (i + 1) * 2 - 1;

      let lowest = right;

      if (left >= this.items.length && right >= this.items.length) break;

      if (left >= this.items.length) lowest = right;
      if (right >= this.items.length) lowest = left;

      if (left < this.items.length && right < this.items.length) {
        lowest = this.selector(this.items[right]) < this.selector(this.items[left])
          ? right
          : left;
      }

      if (this.selector(this.items[i]) > this.selector(this.items[lowest])) {
        [this.items[i], this.items[lowest]] = [this.items[lowest], this.items[i]];

        i = lowest;
      } else break;
    }

    return ret;
  };
}

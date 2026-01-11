# React `useState` – Simple Beginner Notes

## What is `useState`?

`useState` is a **React Hook** that lets a component remember data.

👉 In simple words: **It creates a variable whose value React can track and update on screen.**

---

## Why do we need `useState`?

Normal variables change value, but **React will NOT re-render the screen** when normal variables change.

`useState` tells React:

> "Hey React, this value changed — please update the UI."

---

## Basic Syntax

```js
const [stateValue, setStateValue] = useState(initialValue);
```

### Meaning (very important)

* `stateValue` → current value
* `setStateValue` → function to change the value
* `initialValue` → starting value

---

## Your Counter Example Explained

```js
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Increased Count : {count}
      </button>
    </div>
  );
}
```

### Line-by-line explanation

### 1️⃣ Component creation

```js
function Counter() {
```

* This creates a **React component** named `Counter`

---

### 2️⃣ useState line (MOST IMPORTANT)

```js
const [count, setCount] = useState(0);
```

* `count` → value stored in memory (starts at 0)
* `setCount` → function to change `count`
* `0` → initial value

React stores `count` internally.

---

### 3️⃣ Button click logic

```js
<button onClick={() => setCount(count + 1)}>
```

When button is clicked:

1. `setCount(count + 1)` runs
2. React updates `count`
3. React **re-renders** the component
4. New value appears on screen

---

### 4️⃣ Showing value on screen

```js
Increased Count : {count}
```

* `{count}` means "show the current value"
* Whenever `count` changes, UI updates automatically

---

## What happens when button is clicked?

### First render

* `count = 0`
* Screen shows → `Increased Count : 0`

### Click 1

* `setCount(1)`
* React re-renders
* Screen shows → `Increased Count : 1`

### Click 2

* `setCount(2)`
* React re-renders
* Screen shows → `Increased Count : 2`

---

## IMPORTANT RULES of `useState`

1️⃣ Never change state like this ❌

```js
count = count + 1
```

2️⃣ Always use setter function ✅

```js
setCount(count + 1)
```

3️⃣ State update = Re-render

---

## One-line Summary

> `useState` creates a value + updater function, and React re-renders the component whenever that value changes.

---

If you want next:

* `useEffect` explained like this
* OR build a **simple Pomodoro timer step by step**
* OR understand **how React re-render works internally**

Tell me 👍

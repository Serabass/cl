export function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

const writeToStream = (stream, chunk, cb) => {
  const isFull = !stream.write(chunk);

  if (isFull) {
    stream.once('drain', cb)
  } else {
    cb();
  }
}

module.exports = {
  writeToStream
}

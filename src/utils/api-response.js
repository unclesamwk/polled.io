export default ({
  res,
  status = 200,
  data
}) => {
  if (res.headersSent) {
    return
  }

  if (!data) {
    return res.status(status)
  }

  return res.status(status).json({
    data,
    status,
  })
}

const Notification = ({ errorMessage, infoMessage }) => {
  if (errorMessage === null && infoMessage === null) {
    return null
  }
  if (errorMessage) {
    return <div className='error'>{errorMessage}</div>
  }
  if (infoMessage) {
    return <div className='info'>{infoMessage}</div>
  }
}

export default Notification

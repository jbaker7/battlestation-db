export const modalStyle: ReactModal.Styles =  {
    overlay: {
      backgroundColor: 'rgba(15, 15, 15, 0.85)',
      backdropFilter: 'blur(5px)',
      zIndex: '500'
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: '0px',
      outline: '0px',
    }
  }
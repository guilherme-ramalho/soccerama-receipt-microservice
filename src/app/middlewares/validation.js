const betValidation = (request, response, next) => {
  const bet = request.body;

  // The absence of userID means that the bet hasn't been validate yet
  if (!bet.usuarioId) {
    return response.status(406).json({
      data: null,
      meta: {
        status: 'warning',
        message:
          'Não é possível gerar o comprovante pois a aposta ainda não foi validada.',
      },
    });
  }

  return next();
};

export default betValidation;

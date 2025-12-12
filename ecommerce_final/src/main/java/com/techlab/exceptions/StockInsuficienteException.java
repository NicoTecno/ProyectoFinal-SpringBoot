package com.techlab.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// ¡CRÍTICO! Debe extender de RuntimeException
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class StockInsuficienteException extends RuntimeException {

    public StockInsuficienteException(String message) {
        super(message);
    }

    // Opcional: Constructor que acepta causa
    public StockInsuficienteException(String message, Throwable cause) {
        super(message, cause);
    }
}
package fr.xenonbyte.optifact.backend.application.common.exception;

import java.io.Serializable;


public class TechnicalException extends RuntimeException {

    private Object[] args;


    public TechnicalException(String message) {
        super(message);
    }


    public TechnicalException(String message, Throwable cause) {
        super(message, cause);
    }


    public TechnicalException(String message, Serializable... args) {
        super(message);
        this.args = args;
    }


    public TechnicalException(String message, Throwable cause, Serializable... args) {
        super(message, cause);
        this.args = args;
    }


    public Object[] getArgs() {
        return args;
    }
}
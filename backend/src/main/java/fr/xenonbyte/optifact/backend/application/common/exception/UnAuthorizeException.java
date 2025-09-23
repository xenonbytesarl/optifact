package fr.xenonbyte.optifact.backend.application.common.exception;

import java.io.Serializable;


public class UnAuthorizeException extends RuntimeException {

    private Object[] args;


    public UnAuthorizeException(String message) {
        super(message);
    }


    public UnAuthorizeException(String message, Throwable cause) {
        super(message, cause);
    }


    public UnAuthorizeException(String message, Serializable... args) {
        super(message);
        this.args = args;
    }


    public UnAuthorizeException(String message, Throwable cause, Serializable... args) {
        super(message, cause);
        this.args = args;
    }


    public Object[] getArgs() {
        return args;
    }
}
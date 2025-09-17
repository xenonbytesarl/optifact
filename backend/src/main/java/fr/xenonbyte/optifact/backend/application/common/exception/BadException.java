package fr.xenonbyte.optifact.backend.application.common.exception;


import java.io.Serializable;

public abstract class BadException extends RuntimeException {

    private Object[] args;

    protected BadException(String message) {
        super(message);
    }

    protected BadException(String message, Serializable... args) {
        super(message);
        this.args = args;
    }

    protected BadException() {
    }

    public Object[] getArgs() {
        return args;
    }

}

package fr.xenonbyte.optifact.backend.application.common.exception;


import java.io.Serializable;

public abstract class ConflictException extends RuntimeException {

    private Object[] args;

    protected ConflictException(String message) {
        super(message);
    }

    protected ConflictException(String message, Serializable... args) {
        super(message);
        this.args = args;
    }

    public Object[] getArgs() {
        return args;
    }

}

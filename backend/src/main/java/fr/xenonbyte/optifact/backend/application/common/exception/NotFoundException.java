package fr.xenonbyte.optifact.backend.application.common.exception;


import java.io.Serializable;

public abstract class NotFoundException extends RuntimeException {

    private Object[] args;

    protected NotFoundException(String message) {
        super(message);
    }

    protected NotFoundException(String message, Serializable... args) {
        super(message);
        this.args = args;
    }

    public Object[] getArgs() {
        return args;
    }

}

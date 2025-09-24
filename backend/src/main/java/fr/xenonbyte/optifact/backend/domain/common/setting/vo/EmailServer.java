package fr.xenonbyte.optifact.backend.domain.common.setting.vo;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.time.ZonedDateTime;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public final class EmailServer {
    private final String from;
    private final MailServerType type;
    private final String host;
    private final Integer port;
    private final String protocol;
    private final Boolean useTLS;
    private final Boolean useAuth;
    private final String username;
    private final String password;
    private final MailServerState state;
    private final ZonedDateTime confirmedAt;

    public EmailServer(
            String from,
            MailServerType type,
            String host,
            Integer port,
            String protocol,
            Boolean useTLS,
            Boolean useAuth,
            String username,
            String password,
            MailServerState state,
            ZonedDateTime confirmedAt
    ) {
        this.from = from;
        this.type = type;
        this.host = host;
        this.port = port;
        this.protocol = protocol;
        this.useTLS = useTLS;
        this.useAuth = useAuth;
        this.username = username;
        this.password = password;
        this.state = state == null ? MailServerState.NEW : state;
        this.confirmedAt = confirmedAt;
    }

    public static EmailServer with(
            String from,
            MailServerType type,
            String host,
            Integer port,
            String protocol,
            Boolean useTLS,
            Boolean useAuth,
            String username,
            String password,
            MailServerState state,
            ZonedDateTime confirmedAt) {
        return new EmailServer(from, type, host, port, protocol, useTLS, useAuth, username, password, state, confirmedAt);
    }

    public EmailServer update(EmailServer emailServer) {
        return new EmailServer(emailServer.getFrom(), emailServer.getType(), emailServer.getHost(), emailServer.getPort(), emailServer.getProtocol(), emailServer.getUseTLS(), emailServer.getUseAuth(), emailServer.getUsername(), emailServer.getPassword(), emailServer.getState(),emailServer.getConfirmedAt());
    }

    public EmailServer withWaiting() {
        return new EmailServer(from, type, host, port, protocol, useTLS, useAuth, username, password, MailServerState.WAITING, confirmedAt);
    }

    public EmailServer withConfirmed() {
        return new EmailServer(from, type, host, port, protocol, useTLS, useAuth, username, password, MailServerState.CONFIRM, ZonedDateTime.now());
    }

    public String getFrom() {
        return from;
    }

    public MailServerType getType() {
        return type;
    }

    public String getHost() {
        return host;
    }

    public Integer getPort() {
        return port;
    }

    public String getProtocol() {
        return protocol;
    }

    public Boolean getUseTLS() {
        return useTLS;
    }

    public Boolean getUseAuth() {
        return useAuth;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public MailServerState getState() {
        return state;
    }

    public ZonedDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public EmailServer definePassword(String password) {
        return new EmailServer(from, type, host, port, protocol, useTLS, useAuth, username, password, state, confirmedAt);
    }
}

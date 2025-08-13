-- Add chat table and update lances/messages relations
ALTER TABLE lances
    DROP COLUMN status;

CREATE TABLE chat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lance_id BIGINT NOT NULL,
    proposta_aceita BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (lance_id) REFERENCES lances(id) ON DELETE CASCADE
);

DROP TABLE mensagens;

CREATE TABLE mensagens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    conteudo TEXT NOT NULL,
    enviada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remetente ENUM('USUARIO', 'ADVOGADO') NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
);

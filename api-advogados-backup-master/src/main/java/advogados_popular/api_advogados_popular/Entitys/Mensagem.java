package advogados_popular.api_advogados_popular.Entitys;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Mensagem.java
@Entity
@Table(name = "mensagens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mensagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String conteudo;
    private LocalDateTime enviadaEm;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;

    private String remetente; // "USUARIO" ou "ADVOGADO"
}

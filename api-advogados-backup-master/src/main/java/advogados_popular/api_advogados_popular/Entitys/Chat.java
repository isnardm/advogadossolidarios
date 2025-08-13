package advogados_popular.api_advogados_popular.Entitys;

import jakarta.persistence.*;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Chat.java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "lance_id")
    private Lance lance;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    private List<Mensagem> mensagens;

    private boolean propostaAceita;
}

package advogados_popular.api_advogados_popular.Entitys;

import jakarta.persistence.*;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Lance.java
@Entity
@Table(name = "lances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Lance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal valor;

    @ManyToOne
    @JoinColumn(name = "causa_id")
    private Causa causa;

    @ManyToOne
    @JoinColumn(name = "advogado_id")
    private Advogado advogado;

    @OneToOne(mappedBy = "lance", cascade = CascadeType.ALL)
    private Chat chat;
}


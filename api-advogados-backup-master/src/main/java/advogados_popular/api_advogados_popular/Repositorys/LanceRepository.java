package advogados_popular.api_advogados_popular.Repositorys;

import advogados_popular.api_advogados_popular.Entitys.Lance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LanceRepository extends JpaRepository<Lance, Long> {
    List<Lance> findByCausa_Usuario_IdAndChat_PropostaAceitaFalse(Long usuarioId);
}


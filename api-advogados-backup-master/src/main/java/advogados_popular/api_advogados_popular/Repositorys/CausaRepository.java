package advogados_popular.api_advogados_popular.Repositorys;

import advogados_popular.api_advogados_popular.DTOs.statusCausa;
import advogados_popular.api_advogados_popular.DTOs.statusProposta;
import advogados_popular.api_advogados_popular.Entitys.Causa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CausaRepository extends JpaRepository<Causa, Long> {
    List<Causa> findByStatusNot(statusCausa status);

    List<Causa> findByLances_Advogado_IdAndLances_Chat_Status(Long advogadoId, statusProposta status);
}

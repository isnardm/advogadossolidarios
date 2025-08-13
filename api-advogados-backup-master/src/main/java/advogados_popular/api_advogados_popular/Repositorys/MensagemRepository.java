package advogados_popular.api_advogados_popular.Repositorys;

import advogados_popular.api_advogados_popular.Entitys.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    List<Mensagem> findByChatId(Long chatId);
}


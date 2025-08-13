package advogados_popular.api_advogados_popular.Repositorys;

import advogados_popular.api_advogados_popular.Entitys.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}


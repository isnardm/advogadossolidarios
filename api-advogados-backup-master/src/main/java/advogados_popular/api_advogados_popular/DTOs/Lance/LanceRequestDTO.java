package advogados_popular.api_advogados_popular.DTOs.Lance;

import java.math.BigDecimal;

public record LanceRequestDTO(Long causaId, BigDecimal valor, String comentario) {
}


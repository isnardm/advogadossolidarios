package advogados_popular.api_advogados_popular.DTOs.Lance;

import advogados_popular.api_advogados_popular.DTOs.statusProposta;
import java.math.BigDecimal;

public record LanceRecebidaResponseDTO(Long id,
                                      BigDecimal valor,
                                      Long causaId,
                                      String causaTitulo,
                                      Long advogadoId,
                                      String advogadoNome,
                                      statusProposta status,
                                      Long chatId) {
}

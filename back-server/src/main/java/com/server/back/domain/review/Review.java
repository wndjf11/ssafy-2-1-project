package com.server.back.domain.review;

import com.server.back.domain.pocha.Pocha;
import com.server.back.domain.user.User;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;
    @Column(nullable = false)
    private Integer reviewScore;
    @Column(nullable = false)
    private LocalDateTime create_at;
    private LocalDateTime review_at;

    @ManyToOne(targetEntity=User.class, fetch=FetchType.LAZY)
    @JoinColumn(name="to_id")
    private User toId;

    @ManyToOne(targetEntity=User.class, fetch=FetchType.LAZY)
    @JoinColumn(name="from_id")
    private User fromId;
    @ManyToOne(targetEntity = Pocha.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "web_id")
    private Pocha pocha;


    @Builder
    public Review(Long reviewId, Integer reviewScore, LocalDateTime create_at, LocalDateTime review_at,
                  Pocha pocha, User toId, User fromId) {
        this.reviewId = reviewId;
        this.reviewScore = reviewScore;
        this.create_at = create_at;
        this.review_at = review_at.plusDays(3);
        this.pocha = pocha;
        this.toId = toId;
        this.fromId = fromId;
    }
}
